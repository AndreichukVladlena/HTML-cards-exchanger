import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import PostcardItem from "../components/PostcardItem";
import Warning from "../components/Warning";

export default function CardsPage({ title, api_response }) {
  const { user } = useContext(UserContext);
  const [postcards, setPostcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState(title);
  const [apiResponse, setApiResponse] = useState(api_response);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostcards = async () => {
      try {
        const response = await axios.get(apiResponse);
        setPostcards(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    setPageTitle(title);
    setApiResponse(api_response);
    fetchPostcards();
  }, [title, api_response, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
                To view cards you need to{" "}
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

  if (error && !(error.response?.status === 401)) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {postcards.length > 0 ? (
          postcards.map((postcard) => (
            <PostcardItem key={postcard._id} postcard={postcard} />
          ))
        ) : (
          <div>No postcards found.</div>
        )}
      </div>
    </div>
  );
}
