import React, { useState } from "react";
import {
    Box,
    Button,
    Input,
    VStack,
    HStack,
    Image,
    Text,
    IconButton,
    useToast,
    Textarea,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { submitForProcess, uploadImages } from "../../data/user";

const Dashboard = () => {
    const [images, setImages] = useState([]);
    const [masterPrompt, setMasterPrompt] =
        useState(`You are an interior designer working with a client to choose art for their home.
For the wall photo attached:  
**Vision:**  
- Develop a detailed vision about what kind of art would fit on this wall.  
- Take into consideration the room's colors.  
- Take into consideration style, organization, furniture, anything you can learn about the space or the people living there.  

**Based on the vision, give me:**  
- A short, one-sentence user-facing summary about what kind of art would fit on this wall. Use simple, conversational language, like you would talk to a friend. Assume I know nothing about art.  
- **Art Sets:**  
  - Define three specific art-sets of three art pieces each that fit your vision.  
  - Depending on the wall space and frame size, sometimes we will want to use only one or two pieces out of the set of three. Therefore:  
    - The first two should also work together as a standalone set.  
    - The 1st piece should be the main or best piece of the set that can be hanged alone on the wall.  
  - Give each set a short one-word title.  
  - For each art piece, write a full, descriptive prompt that I can feed to Ideogram to create the piece you envision.

`);
    const [csvData, setCsvData] = useState([]);
    const toast = useToast();

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const imageUrls = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prevImages) => [...prevImages, ...imageUrls]);
    };

    const handleCsvUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            const rows = text.split("\n").map((row) =>
                row
                    .split(",")
                    .map((cell) => cell.trim())
                    .join(",")
            );
            setCsvData(rows);
        };

        reader.readAsText(file);
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

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
            const { status, data, msg } = await uploadImages(formData);
            if (!status) {
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
                images: data.map((o) => o.url),
                pos_strs: csvData.filter(Boolean),
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
            <Box w="100%">
                <Text fontWeight="bold" mb={2}>
                    Master Prompt
                </Text>
                <Textarea
                    placeholder="Enter a master prompt for all images"
                    value={masterPrompt}
                    onChange={(e) => setMasterPrompt(e.target.value)}
                    noOfLines={10}
                    minH="250px"
                />
            </Box>

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
                                boxSize="200px"
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

            <Box w="100%">
                <Text fontWeight="bold" mb={2}>
                    Upload CSV
                </Text>
                <Input type="file" accept=".csv" onChange={handleCsvUpload} />
            </Box>

            <Box w="100%">
                <Text fontWeight="bold" mb={2}>
                    CSV Data
                </Text>
                {csvData.length > 0 ? (
                    <Textarea
                        placeholder="CSV Data"
                        value={csvData.join("\n")}
                        onChange={(e) => setCsvData(e.target.value.split("\n"))}
                        noOfLines={10}
                        minH="150px"
                    />
                ) : (
                    <Text>No CSV data available</Text>
                )}
            </Box>

            <Button colorScheme="blue" onClick={handleSubmit} width="100%">
                Submit
            </Button>
        </VStack>
    );
};

export default Dashboard;
