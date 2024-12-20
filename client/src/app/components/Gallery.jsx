import {
    Badge,
    Card,
    CardBody,
    CardFooter,
    Grid,
    Heading,
    Image,
    Spacer,
    Stack,
    Text,
} from "@chakra-ui/react";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { connectSocket } from "../../data/socket";
import { filterWalls } from "../../data/user";
import Pagination from "../common/Pagination";
const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const Gallery = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [forceRefresh, setForceRefresh] = useState(0);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
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
    }, [page, limit, forceRefresh]);

    useEffect(() => {
        fetchData();
    }, [fetchData, forceRefresh]);

    useEffect(() => {
        const socket = connectSocket();
        socket.on("img_status", () => {
            setForceRefresh(e=>e+1);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <Heading size="lg" mb="6">
                Gallery of Walls
            </Heading>

            {loading && <p>Loading...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && data.length > 0 && (
                <Grid
                    templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                        xl: "repeat(4, 1fr)",
                    }}
                    gap={6}
                    alignItems="center"
                    justifyContent="center"
                    w="100%"
                >
                    {data.map((item, index) => (
                        <Card
                            onClick={() =>
                                navigate(`${ROUTES.VISSUALIZE}/${item._id}`)
                            }
                            cursor="pointer"
                        >
                            <CardBody>
                                <Image
                                    src={`${BASE_URL}/uploads/${item.img_path}`}
                                    alt="Green double couch with wooden legs"
                                    borderRadius="lg"
                                    height="200px"
                                    objectFit="cover"
                                    w="100%"
                                />
                                <Stack mt="6" spacing="3">
                                    <Heading size="md">
                                        {item.pos_csv.split(",")[0].trim() ||
                                            "Unnamed wall"}
                                    </Heading>
                                    <Text noOfLines={3}>
                                        {item.vision ||
                                            "No Description Available"}
                                    </Text>
                                    <Text color="blue.600" fontSize="2xl">
                                        {item.art_count || 0} arts
                                    </Text>
                                </Stack>
                            </CardBody>
                            <CardFooter>
                                <Badge
                                    colorScheme={
                                        item.status === "completed"
                                            ? "green"
                                            : item.status.includes("failed")
                                              ? "red"
                                              : "yellow"
                                    }
                                >
                                    {item.status}
                                </Badge>
                            </CardFooter>
                        </Card>
                    ))}
                </Grid>
            )}
            <Spacer h={8} />
            <Pagination
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
            />
        </div>
    );
};

export default Gallery;
