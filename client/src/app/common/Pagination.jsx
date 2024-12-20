import { Box, Button, HStack, Select, Text } from '@chakra-ui/react';

const Pagination = ({ page, setPage, limit, setLimit }) => {
  return (
    <Box mt={4} p={4} borderWidth={1} borderRadius="md" boxShadow="sm" bg="white">
      <HStack justify="space-between" align="center" mb={4}>
        <Button 
          colorScheme="teal" 
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
          isDisabled={page === 1}
        >
          Previous
        </Button>
        
        <Text fontWeight="bold">Page {page}</Text>
        
        <Button 
          colorScheme="teal" 
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </HStack>
      
      <HStack justify="flex-start" align="center">
        <Text fontWeight="medium">Items per page:</Text>
        <Select 
          w="auto" 
          value={limit} 
          onChange={(e) => setLimit(Number(e.target.value))} 
          bg="white" 
          borderColor="teal.500"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Select>
      </HStack>
    </Box>
  );
};

export default Pagination;

