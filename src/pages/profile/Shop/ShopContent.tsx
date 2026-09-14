import { MoreVertical, Pencil, Trash2, Share2, Copy, ShoppingBagIcon, PencilIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { FaClosedCaptioning, FaCross, FaGifts, FaTimes, FaWatchmanMonitoring } from "react-icons/fa";

interface Item {
  id: number;
  name: string;
  img: string;
  category: string;
}

interface ContentProps {
  data: Item[];
}

const ShopContent: React.FC<ContentProps> = ({ data }) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [

    { label: "Share", icon: Share2, onClick: (id: number) => console.log("share", id) },
    { label: "Promote", icon: FaGifts, onClick: (id: number) => console.log("share", id) },
    { label: "Unsell", icon: FaTimes, onClick: (id: number) => console.log("edit", id) },
    { label: "Edit Price", icon: PencilIcon, onClick: (id: number) => console.log("edit", id) },
    { label: "Delete", icon: Trash2, onClick: (id: number) => console.log("delete", id), danger: true },
  ];

  return (
    <div className="container">
      <div className="d-flex flex-wrap gap-2">
        {data.length === 0 ? (
          <p>No results found</p>
        ) : (
          data.map((item) => (
            <div key={item.id} className="flex-shrink-0" style={{ width: "300px", marginBottom: "10px" }}>
              <div className="w-full">
                <div className="relative" ref={openId === item.id ? menuRef : null}>
                  <img
                    className="w-full h-[250px] object-cover rounded bg-white"
                    src={item.img}
                    alt={item.name}
                  />

                  {/* Trigger */}
                  <button
                    className="absolute top-2 right-2 bg-black/80 text-white hover:bg-gray-500 p-2 rounded-full shadow transition"
                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  >
                    <MoreVertical fill="white" size={18} />
                  </button>

                  {/* Dropdown — only for this card */}
                  {openId === item.id && (
                    <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      {actions.map(({ label, icon: Icon, onClick, danger }) => (
                        <button
                          key={label}
                          onClick={() => { onClick(item.id); setOpenId(null); }}
                          className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition hover:bg-gray-50
                            ${danger ? "text-red-500 hover:text-red-600" : "text-gray-700"}`}
                        >
                          <Icon size={14} />
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="feat-desc mt-3">
                  <p>{item.name}</p>
                  <p>GHS 22</p>
                  <p>GHS 34</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopContent;