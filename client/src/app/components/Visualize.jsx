import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { filterWalls, updatePos } from "../../data/user";
import {
    Box,
    Image,
    Text,
    VStack,
    Heading,
    SimpleGrid,
    Card,
    CardBody,
    Divider,
    Input,
    Flex,
    Button,
    Badge,
} from "@chakra-ui/react";
import { connectSocket } from "../../data/socket";
const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const Visualize = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pos, setPos] = useState("");
    const [forceRefresh, setForceRefresh] = useState(0);
    useEffect(() => {
        if (data) {
            setPos(data.pos_csv);
        }
    }, [data]);

    useEffect(() => {
        const socket = connectSocket();
        socket.on("img_status", ({ id: _id, status }) => {
            if (id === _id) {
                setForceRefresh((e) => e + 1);
            }
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const handlePosUpdate = async () => {
        try {
            const response = await updatePos({ id, pos_csv: pos });
            if (response.status) {
                alert("Position updated successfully.");
            } else {
                alert("Failed to update position.");
            }
        } catch (err) {
            alert("An error occurred while updating position.");
        }
    };

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
    }, [id, forceRefresh]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    if (!data) {
        return <div>No data available</div>;
    }

    const { img_path, arts } = data;

    return (
        <Box minW="100%" minH="100%" p={4} bg="gray.50">
            <Flex w="100%" bg="green" py={8} justifyContent="center" overflow="hidden">
                <Box display="inline" position="relative" >
                    <Image
                        src={`${BASE_URL}/uploads/${img_path}`}
                        alt="Wall Background"
                        maxW="100%"
                        maxH="360px"
                        objectFit="cover"
                        borderRadius="md"
                        mb={4}
                    />
                    {arts &&
                        arts
                            .slice(0, pos.split(",").slice(1).length / 2)
                            .map((art, index) => {
                                const [x, y] = pos
                                    .split(",")
                                    .slice(1 + index * 2, 1 + index * 2 + 2)
                                    .map((e) => e.trim())
                                    .filter(Boolean)
                                    .map(Number);
                                if (isNaN(x) || isNaN(y)) return null;
                                return (
                                    <Image
                                        key={index}
                                        src={art.url}
                                        alt={art.title}
                                        position="absolute"
                                        left={`${x}px`}
                                        top={`${y}px`}
                                        w="100px"
                                        h="100px"
                                    />
                                );
                            })}
                </Box>
            </Flex>
            <Box
                key={data._id}
                borderWidth="1px"
                borderRadius="md"
                p={6}
                mb={6}
                bg="white"
                boxShadow="lg"
            >
                <VStack align="flex-start" spacing={6}>
                    <Box w="100%">
                        <Heading size="lg" mb={2}>
                            Position CSV
                        </Heading>
                        <Flex align="flex-start">
                            <Input
                                value={pos}
                                onChange={(e) => setPos(e.target.value)}
                            />
                            <Box ml={4}>
                                <Button
                                    colorScheme="blue"
                                    onClick={handlePosUpdate}
                                >
                                    Update
                                </Button>
                            </Box>
                        </Flex>
                    </Box>
                    <Divider />
                    <Box w="100%">
                        <Heading size="md" mb={2}>
                            Status:{" "}
                            <Badge
                                colorScheme={
                                    data.status === "completed"
                                        ? "green"
                                        : data.status.includes("failed")
                                          ? "red"
                                          : "yellow"
                                }
                            >
                                {data.status}
                            </Badge>
                        </Heading>
                    </Box>
                    <Divider />
                    <Box w="100%">
                        <Heading size="lg" mb={2}>
                            Master Prompt
                        </Heading>
                        <Text fontSize="md">{data.masterPrompt}</Text>
                    </Box>
                    <Divider />
                    <Box w="100%">
                        <Heading size="lg" mb={2}>
                            Art Count
                        </Heading>
                        <Text fontSize="md">{data.art_count}</Text>
                    </Box>
                    <Divider />
                    <Box w="100%">
                        <Heading size="lg" mb={2}>
                            Vision
                        </Heading>
                        <Text fontSize="md">{data.vision}</Text>
                    </Box>
                    <Divider />
                    <Box w="100%">
                        <Heading size="lg" mb={2}>
                            Description
                        </Heading>
                        <Text fontSize="md">{data.description}</Text>
                    </Box>
                </VStack>

                <Heading as="h4" mt={8} mb={4} size="lg">
                    Arts
                </Heading>
                <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                    {arts.map((art, artIndex) => (
                        <Card
                            key={artIndex}
                            boxShadow="lg"
                            borderRadius="lg"
                            overflow="hidden"
                        >
                            <Image
                                src={art.url}
                                alt={art.title}
                                w="100%"
                                h="200px"
                                objectFit="cover"
                            />
                            <CardBody p={6}>
                                <Heading size="md" mb={2} textAlign="center">
                                    {art.title}
                                </Heading>
                                <Divider mb={4} />
                                <Box w="100%">
                                    <Heading size="sm" mb={1}>
                                        Theme
                                    </Heading>
                                    <Text fontSize="sm">{art.theme}</Text>
                                </Box>
                                <Divider my={4} />
                                <Box w="100%">
                                    <Heading size="sm" mb={1}>
                                        Prompt
                                    </Heading>
                                    <Text fontSize="sm">{art.prompt}</Text>
                                </Box>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>
            </Box>
        </Box>
    );
};

export default Visualize;
