import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Get today's date as a seed for consistent daily quotes
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];

        // Use date as seed to get consistent quote for the day
        const seed = dateString.split('-').join('');

        // Fetch from ZenQuotes API (free, no API key required)
        const response = await fetch('https://zenquotes.io/api/today', {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }

        const data = await response.json();

        // ZenQuotes returns an array with one quote
        const quote = data[0];

        return NextResponse.json({
            text: quote.q,
            author: quote.a,
            date: dateString
        });
    } catch (error) {
        console.error('Error fetching quote:', error);

        // Fallback quotes
        const fallbackQuotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" }
        ];

        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
        const fallbackQuote = fallbackQuotes[dayOfYear % fallbackQuotes.length];

        return NextResponse.json({
            text: fallbackQuote.text,
            author: fallbackQuote.author,
            date: today.toISOString().split('T')[0]
        });
    }
}
