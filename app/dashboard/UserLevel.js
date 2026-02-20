export default function UserLevel({ stats }) {
    // Default stats if not provided yet
    const soldCount = stats?.sold || 0;

    // Level Logic
    let currentLevel = 1;
    let levelName = "Spark";
    let nextLevelName = "Blaze";
    let minCoupons = 0;
    let maxCoupons = 30;
    let limit = 7;
    let discount = 0;

    if (soldCount >= 30 && soldCount < 100) {
        currentLevel = 2;
        levelName = "Blaze";
        nextLevelName = "Inferno";
        minCoupons = 30;
        maxCoupons = 100;
        limit = 15;
        discount = 2;
    } else if (soldCount >= 100) {
        currentLevel = 3;
        levelName = "Inferno";
        nextLevelName = "Max Level";
        minCoupons = 100;
        maxCoupons = 100; // Cap
        limit = 30;
        discount = 5;
    }

    // Calculate progress percentage
    let progress = 0;
    if (currentLevel < 3) {
        progress = ((soldCount - minCoupons) / (maxCoupons - minCoupons)) * 100;
    } else {
        progress = 100;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 text-center">
                <h3 className="text-xl font-bold text-gray-800">User Level</h3>
            </div>

            <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#b91c1c] mb-1">Level {currentLevel} - {levelName}</h2>
                    <div className="flex justify-around mt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{limit}</div>
                            <div className="text-xs text-gray-500 mt-1">Upload Limit/day</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{discount}%</div>
                            <div className="text-xs text-gray-500 mt-1">Buyer Discount</div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h4 className="font-bold text-gray-800 mb-4">Level Progress</h4>

                    <div className="text-center mb-2">
                        <span className="text-3xl font-bold text-[#b91c1c]">{soldCount} / {currentLevel < 3 ? maxCoupons : '∞'}</span>
                        <p className="text-sm text-gray-500 mt-1">coupons sold</p>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
                        <div className="bg-[#E50914] h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{Math.round(progress)}% Complete</div>
                        {currentLevel < 3 ? (
                            <p className="text-sm text-gray-500 mt-2">
                                {maxCoupons - soldCount} more sales needed for <span className="font-bold text-[#b91c1c]">{nextLevelName}</span>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 mt-2 text-green-600 font-bold">
                                Maximum Level Reached!
                            </p>
                        )}
                        <p className="text-xs text-gray-400 italic mt-1">Level up by selling coupons</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
