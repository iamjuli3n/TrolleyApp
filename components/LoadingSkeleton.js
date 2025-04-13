export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-200 animate-pulse h-20 rounded-xl"></div>
      ))}
    </div>
  );
}
