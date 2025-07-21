export default function ProductCard({ name, image, price }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg transition">
      <img src={image} alt={name} className="w-full h-40 object-cover rounded-md mb-4" />
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-pink-600 font-semibold mt-2">R$ {price.toFixed(2)}</p>
    </div>
  );
}
