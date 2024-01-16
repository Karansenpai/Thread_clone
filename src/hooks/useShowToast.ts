import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";


export const useShowToast = () => {
  
  const toast = useToast();
  const showToast = useCallback((title: string,description: string,status:"info" | "warning" | "success" | "error" | "loading" | undefined) => {

    toast({
        title,
        description,
        status,
        duration: 3000,
        isClosable: true,
    });
    },
    [toast]
  );
  
  return showToast;
}

export default useShowToast;