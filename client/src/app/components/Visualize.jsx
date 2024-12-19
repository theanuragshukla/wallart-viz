import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { filterWalls } from "../../data/user";

const Visualize = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await filterWalls({
                    id,
                });
                if (response.status) {
                    setData(response.data[0]);
                } else {
                    setError("No data found for the given ID");
                }
            } catch (err) {
                setError("An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    if (!data) {
        return <div>No data available</div>;
    }

    const { img_path, arts, pos_csv } = data;

    return (
        <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
            <img
                src={`http://localhost:5000/uploads/${img_path}`}
                alt="Wall Background"
                style={{ width: "500px", height: "360px", objectFit: "cover" }}
            />
            {arts &&
                arts.slice(0, data.art_count).map((art, index) => {
                    const [x, y] = pos_csv
                        .split(",")
                        .slice(1)
                        .slice(index * 2, index * 2 + 2)
                        .map(Number);
                    const width = 100;
                    const height = 100;
                    return (
                        <img
                            key={index}
                            src={art.url}
                            alt={art.title}
                            style={{
                                position: "absolute",
                                left: `${x}px`,
                                top: `${y}px`,
                                width: `${width}px`,
                                height: `${height}px`,
                            }}
                        />
                    );
                })}

            <div
                key={data._id}
                style={{
                    border: "1px solid #ccc",
                    padding: "16px",
                    marginBottom: "16px",
                }}
            >
                <p>
                    <strong>Master Prompt:</strong> {data.masterPrompt}
                </p>
                <p>
                    <strong>Art Count:</strong> {data.art_count}
                </p>
                <p>
                    <strong>Vision Description:</strong>{" "}
                    {data.vision_description}
                </p>
                <h4>Arts</h4>
                {arts.map((art, artIndex) => (
                    <div
                        key={artIndex}
                        style={{
                            paddingLeft: "16px",
                            marginBottom: "10px",
                        }}
                    >
                        <p>
                            <strong>Title:</strong> {art.title}
                        </p>
                        <p>
                            <strong>Theme:</strong> {art.theme}
                        </p>
                        <p>
                            <strong>Prompt:</strong> {art.prompt}
                        </p>
                        <img
                            src={art.url}
                            alt={art.title}
                            style={{
                                width: "100px",
                                height: "100px",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Visualize;
