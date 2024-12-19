import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { filterWalls } from "../../data/user";

const Gallery = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await filterWalls({
                page: page,
                limit: limit,
            });

            if (response.status) {
                setData(response.data);
            } else {
                setError("No data found");
            }
        } catch (err) {
            setError("An error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    return (
        <div>
            <h1>Uploaded Images</h1>

            {loading && <p>Loading...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && data.length > 0 && (
                <div>
                    {data.map((item, index) => (
                        <div
                            key={item._id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "16px",
                                marginBottom: "16px",
                            }}
                            onClick={() => { navigate(`${ROUTES.VISSUALIZE}/${item._id}`)}}
                        >
                            <h3>UID: {item.uid}</h3>
                            <img
                                src={`http://localhost:5000/uploads/${item.img_path}`}
                                alt="Uploaded"
                                style={{ width: "100px", height: "100px" }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div>
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span> Page {page} </span>
                <button onClick={() => setPage((prev) => prev + 1)}>
                    Next
                </button>
            </div>

            <div>
                <label htmlFor="limit">Items per page: </label>
                <select
                    id="limit"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>
        </div>
    );
};

export default Gallery;
