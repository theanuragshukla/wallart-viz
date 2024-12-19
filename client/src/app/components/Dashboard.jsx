import React, { useState } from "react";
import {
    Box,
    Button,
    Input,
    VStack,
    HStack,
    Image,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    TableContainer,
    useToast,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { submitForProcess, uploadImages } from "../../data/user";

const Dashboard = () => {
    const [images, setImages] = useState([]);
    const [masterPrompt, setMasterPrompt] = useState("");
    const [csvData, setCsvData] = useState([]);
    const toast = useToast();

    // Handle image upload
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const imageUrls = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prevImages) => [...prevImages, ...imageUrls]);
    };

    // Handle CSV file upload
    const handleCsvUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            const rows = text.split("\n").map((row) => row.split(","));
            const formattedData = rows.map((row) =>
                row.map((cell) => cell.trim())
            );
            setCsvData(formattedData);
        };

        reader.readAsText(file);
    };

    // Handle CSV data editing
    const handleCsvEdit = (rowIndex, colIndex, value) => {
        const updatedData = [...csvData];
        updatedData[rowIndex][colIndex] = value;
        setCsvData(updatedData);
    };

    // Remove an uploaded image
    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!masterPrompt) {
            toast({
                title: "Error",
                description: "Master prompt is required.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const formData = new FormData();
        images.forEach((image) => formData.append("images", image.file));

        try {
            const {status, data, msg} = await uploadImages(formData);
            if(!status){
                toast({
                    title: "Error",
                    description: msg || "An error occurred.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
            const result = await submitForProcess({
                masterPrompt,
                images: data.map(o=>o.url),
                pos_strs: csvData.map(row => row.join(",")).filter(Boolean),
            });

            if (result.status) {
                toast({
                    title: "Success",
                    description: "Data submitted successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error",
                    description: result.message || "An error occurred.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Failed to submit data.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <VStack spacing={5} p={5}>
            {/* Master Prompt Input */}
            <Box w="100%">
                <Text fontWeight="bold" mb={2}>
                    Master Prompt
                </Text>
                <Input
                    placeholder="Enter a master prompt for all images"
                    value={masterPrompt}
                    onChange={(e) => setMasterPrompt(e.target.value)}
                />
            </Box>

            {/* Image Upload Section */}
            <Box w="100%">
                <Text fontWeight="bold" mb={2}>
                    Upload Images
                </Text>
                <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                <HStack mt={4} wrap="wrap">
                    {images.map((image, index) => (
                        <Box
                            key={index}
                            position="relative"
                            border="1px solid #ccc"
                            borderRadius="md"
                            overflow="hidden"
                        >
                            <Image
                                src={image.preview}
                                boxSize="100px"
                                objectFit="cover"
                            />
                            <IconButton
                                size="sm"
                                icon={<CloseIcon />}
                                position="absolute"
                                top="2px"
                                right="2px"
                                onClick={() => removeImage(index)}
                            />
                        </Box>
                    ))}
                </HStack>
            </Box>

            {/* CSV Upload Section */}
            <Box w="100%">
                <Text fontWeight="bold" mb={2}>
                    Upload CSV
                </Text>
                <Input type="file" accept=".csv" onChange={handleCsvUpload} />
            </Box>

            {/* CSV Visualization and Editing */}
            <Box w="100%">
                <Text fontWeight="bold" mb={2}>
                    CSV Data
                </Text>
                {csvData.length > 0 ? (
                    <TableContainer maxHeight="300px" overflowY="auto">
                        <Table variant="striped" colorScheme="teal" size="sm">
                            <Thead>
                                <Tr>
                                    {csvData[0].map((_, colIndex) => (
                                        <Th key={colIndex}>
                                            Column {colIndex + 1}
                                        </Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {csvData.map((row, rowIndex) => (
                                    <Tr key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <Td key={`${rowIndex}-${colIndex}`}>
                                                <Input
                                                    size="sm"
                                                    value={cell}
                                                    onChange={(e) =>
                                                        handleCsvEdit(
                                                            rowIndex,
                                                            colIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Td>
                                        ))}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Text>No CSV data available</Text>
                )}
            </Box>

            {/* Submit Button */}
            <Button colorScheme="blue" onClick={handleSubmit} width="100%">
                Submit
            </Button>
        </VStack>
    );
};

export default Dashboard;
