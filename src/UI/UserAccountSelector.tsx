import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

type UserAccount = {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
};

const userAccounts: UserAccount[] = [
    { id: "1", name: "Admin System", email: "admin@example.com", role: "Admin" },
    { id: "2", name: "Jane Doe", email: "jane@example.com", role: "Manager" },
    { id: "3", name: "John Smith", email: "john@example.com", role: "Editor" },
    { id: "4", name: "Sara Wilson", email: "sara@example.com", role: "Viewer" },
];

function UserAccountSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<UserAccount>(userAccounts[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelectAccount = (account: UserAccount) => {
        setSelectedAccount(account);
        setIsOpen(false);

        localStorage.setItem("selectedAccount", JSON.stringify(account));


        window.dispatchEvent(new Event("accountChanged"));
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const savedAccount = localStorage.getItem("selectedAccount");
        if (savedAccount) {
            try {
                setSelectedAccount(JSON.parse(savedAccount));
            } catch (error) {
                console.error("Error loading saved account:", error);
            }
        }
    }, []);

    return (
        <div className="relative w-full max-w-md items-center" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        {selectedAccount.avatar ? (
                            <img
                                src={selectedAccount.avatar}
                                alt={selectedAccount.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-semibold text-sm">
                                {selectedAccount.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {selectedAccount.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {selectedAccount.email}
                        </p>
                    </div>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                    {userAccounts.map((account) => {
                        const isSelected = selectedAccount.id === account.id;

                        return (
                            <button
                                key={account.id}
                                onClick={() => handleSelectAccount(account)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isSelected
                                    ? "bg-blue-50 hover:bg-blue-100"
                                    : "hover:bg-gray-50"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-blue-600" : "bg-gray-400"
                                    }`}>
                                    {account.avatar ? (
                                        <img
                                            src={account.avatar}
                                            alt={account.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white font-semibold text-sm">
                                            {account.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isSelected ? "text-blue-900" : "text-gray-900"
                                        }`}>
                                        {account.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {account.email}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {account.role}
                                    </p>
                                </div>
                                {isSelected && (
                                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default UserAccountSelector;
