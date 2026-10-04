export default function StatCard({ label, value, change, icon: Icon }) {

    const isPositive = change !== undefined && change >= 0;

    return (
        <div className="bg-white border border-black rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-[#22c55e] cursor-pointer  ">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-black">{label}</p>
                    <p className="text-2xl font-bold text-black mt-1">{value}</p>
                </div>

                {Icon && (
                    <div className="w-10 h-10 rounded-lg bg-[#22c55e] flex items-center justify-center text-[#16a34a]">
                        <Icon />
                    </div>
                )}
            </div>

            {change !== undefined && (
                <p className={`text-xs mt-3 ${isPositive ? "text-[#16a34a]" : "text-red-500"}`}>
                    {isPositive ? "▲" : "▼"} {Math.abs(change)}% গত মাসের তুলনায়
                </p>
            )}
        </div>
    );
}