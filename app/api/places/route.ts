import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng");
        const type = searchParams.get("type") || "tourist_attraction";

        if (!lat || !lng) {
            return NextResponse.json(
                { error: "Latitude and longitude are required" },
                { status: 400 }
            );
        }

        // Map frontend types to Overpass QL tags
        const typeMapping: Record<string, string> = {
            tourist_attraction: '["tourism"~"attraction|museum|viewpoint|artwork"]',
            park: '["leisure"="park"]',
            museum: '["tourism"="museum"]',
            cafe: '["amenity"="cafe"]',
            restaurant: '["amenity"="restaurant"]',
            shopping_mall: '["shop"="mall"]',
            spa: '["leisure"="spa"]',
            art_gallery: '["tourism"="gallery"]',
        };

        const tagQuery = typeMapping[type] || typeMapping["tourist_attraction"];
        const radius = 5000; // 5km

        // Overpass QL query
        const query = `
      [out:json][timeout:25];
      (
        node${tagQuery}(around:${radius},${lat},${lng});
        way${tagQuery}(around:${radius},${lat},${lng});
        relation${tagQuery}(around:${radius},${lat},${lng});
      );
      out center 12;
    `;

        const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query,
        });

        if (!response.ok) {
            throw new Error(`Overpass API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform Overpass data to our Place interface
        const places = data.elements.map((element: any) => {
            const tags = element.tags || {};
            const lat = element.lat || element.center?.lat;
            const lng = element.lon || element.center?.lon;

            return {
                id: element.id.toString(),
                name: tags.name || tags.description || "Unnamed Place",
                vicinity: tags["addr:street"]
                    ? `${tags["addr:street"]} ${tags["addr:housenumber"] || ""}`.trim()
                    : "Nearby",
                rating: 0, // Overpass doesn't provide ratings
                userRatingsTotal: 0,
                photos: [], // Overpass doesn't provide photos
                types: [type],
                geometry: {
                    lat: lat,
                    lng: lng,
                },
                openNow: undefined, // Overpass doesn't provide real-time opening status easily
            };
        }).filter((place: any) => place.name !== "Unnamed Place"); // Filter out unnamed places

        return NextResponse.json({ places, status: "OK" });
    } catch (error) {
        console.error("Error fetching places:", error);
        return NextResponse.json(
            { error: "Failed to fetch places" },
            { status: 500 }
        );
    }
}
