import { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import Warning from "../components/Warning";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ItemTypes = {
  TEXT: "text",
};

const DraggableText = ({ text, position, setPosition }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TEXT,
    item: { text },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
    >
      {text}
    </div>
  );
};

const PostcardPreview = ({
  title,
  description,
  setTitlePosition,
  setDescriptionPosition,
  frame,
}) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.TEXT,
    drop: (item, monitor) => {
      const delta = monitor.getClientOffset();
      const dropPosition = {
        x: delta.x - 150, // Adjust based on the width of the text
        y: delta.y - 50, // Adjust based on the height of the text
      };

      if (item.text === title.value) {
        setTitlePosition(dropPosition);
      } else if (item.text === description.value) {
        setDescriptionPosition(dropPosition);
      }
    },
  }));

  return (
    <div
      ref={drop}
      className="postcard-preview relative"
      style={{
        width: "297mm",
        height: "210mm",
        position: "relative",
        backgroundColor: "#fff",
      }}
    >
      {/* Frame */}
      {frame && (
        <div
          className="absolute"
          style={{
            borderTop:
              frame.type === "top-bottom" || frame.type === "full"
                ? `${frame.thickness}px solid ${frame.color || "black"}`
                : "none",
            borderBottom:
              frame.type === "top-bottom" || frame.type === "full"
                ? `${frame.thickness}px solid ${frame.color || "black"}`
                : "none",
            borderLeft:
              frame.type === "left-right" || frame.type === "full"
                ? `${frame.thickness}px solid ${frame.color || "black"}`
                : "none",
            borderRight:
              frame.type === "left-right" || frame.type === "full"
                ? `${frame.thickness}px solid ${frame.color || "black"}`
                : "none",
            borderRadius: "8px",
            boxSizing: "border-box",
            inset: "0",
            pointerEvents: "none",
          }}
        />
      )}
      <DraggableText
        text={title.value}
        position={title.position}
        setPosition={setTitlePosition}
      />
      <DraggableText
        text={description.value}
        position={description.position}
        setPosition={setDescriptionPosition}
      />
    </div>
  );
};

export default function CreatePostcardPage() {
  const { user } = useContext(UserContext);
  const [recipients, setRecipients] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [title, setTitle] = useState({ value: "", position: { x: 0, y: 0 } });
  const [description, setDescription] = useState({
    value: "",
    position: { x: 0, y: 0 },
  });
  const [frame, setFrame] = useState({
    type: "full",
    thickness: 1,
    color: "#000",
    image: null,
  });
  const [background, setBackground] = useState(null);
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/user/all");
        setAllUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleTitlePosition = (pos) =>
    setTitle((prev) => ({ ...prev, position: pos }));
  const handleDescriptionPosition = (pos) =>
    setDescription((prev) => ({ ...prev, position: pos }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postcardData = {
        owner: user._id,
        recipients: selectedRecipients,
        title,
        description,
        frame,
        stickers: [],
        interactiveElements: [],
        background,
        audio,
      };

      const response = await axios.post("/postcard", postcardData);
      console.log("Postcard created:", response.data);
      navigate(`/postcard/${response.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedRecipients(value);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-24 h-24 text-primary animate-bounce mb-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>

        <div className="w-full max-w-md px-4">
          <Warning
            message={
              <>
                To create cards you need to{" "}
                <Link
                  to="/login"
                  className="underline text-white hover:text-gray-200"
                >
                  login
                </Link>
                !
              </>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <div className="flex-1 p-4">
          <PostcardPreview
            title={title}
            description={description}
            setTitlePosition={handleTitlePosition}
            setDescriptionPosition={handleDescriptionPosition}
            frame={frame} // Pass frame properties
          />
        </div>
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Create Postcard</h1>
          {error && <div className="text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block mb-1">Title:</label>
              <input
                type="text"
                value={title.value}
                onChange={(e) => setTitle({ ...title, value: e.target.value })}
                className="border p-2 w-full"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block mb-1">Description:</label>
              <textarea
                value={description.value}
                onChange={(e) =>
                  setDescription({ ...description, value: e.target.value })
                }
                className="border p-2 w-full"
                required
              />
            </div>

            {/* Recipients Selection */}
            <div>
              <label className="block mb-1">Select Recipients:</label>
              <select
                multiple
                value={selectedRecipients}
                onChange={handleRecipientChange}
                className="border p-2 w-full"
              >
                {allUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Frame Type */}
            <div>
              <label className="block mb-1">Frame Type:</label>
              <select
                value={frame.type}
                onChange={(e) => setFrame({ ...frame, type: e.target.value })}
                className="border p-2 w-full"
              >
                <option value="full">Full</option>
                <option value="top-bottom">Top-Bottom</option>
                <option value="left-right">Left-Right</option>
              </select>
            </div>

            {/* Frame Thickness */}
            <div>
              <label className="block mb-1">Frame Thickness:</label>
              <input
                type="number"
                value={frame.thickness}
                onChange={(e) =>
                  setFrame({ ...frame, thickness: Number(e.target.value) })
                }
                className="border p-2 w-full"
                required
              />
            </div>

            {/* Frame Color */}
            <div>
              <label className="block mb-1">Frame Color:</label>
              <input
                type="color"
                value={frame.color}
                onChange={(e) => setFrame({ ...frame, color: e.target.value })}
                className="border p-2 w-full"
              />
            </div>

            {/* Background Image */}
            <div>
              <label className="block mb-1">Background Image:</label>
              <input
                type="file"
                name="bgImage"
                id="bgImage"
                onChange={(e) => setBackground(e.target.files[0])}
                className="border p-2 w-full"
              />
            </div>

            {/* Audio Input */}
            {/* Uncomment if audio upload is needed */}
            {/* <div>
              <label className="block mb-1">Audio:</label>
              <input
                type="file"
                onChange={(e) => setAudio(e.target.files[0])}
                className="border p-2 w-full"
              />
            </div> */}

            <button
              type="submit"
              className={`primary ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Postcard"}
            </button>
          </form>
        </div>
      </div>
    </DndProvider>
  );
}
