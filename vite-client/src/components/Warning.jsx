export default function Warning({ message }) {
  if (!message) return null;

  return (
    <div className="w-full border-2 border-primary bg-primary/60 my-1 py-3 px-5 rounded-2xl text-center text-white text-xl shadow-md shadow-gray-500">
      {message}
    </div>
  );
}
