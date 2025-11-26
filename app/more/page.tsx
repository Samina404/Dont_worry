export default function MorePage() {
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">More Options</h1>

      <ul className="space-y-3 text-blue-500 underline">
        <li><a href="/more/quote">→ Quote Page</a></li>
        <li><a href="/more/weather">→ Weather Home</a></li>
      </ul>
    </div>
  );
}
