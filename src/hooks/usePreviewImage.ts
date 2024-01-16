import React from 'react'
import useShowToast from './useShowToast';

const usePreviewImage = () => {

    const showToast = useShowToast();

    const [imgUrl , setImgUrl] = React.useState<string | ArrayBuffer | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(file && file.type.startsWith('image/')){
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgUrl(reader.result);
            };

            reader.readAsDataURL(file); 
        } else{

            showToast("invalid file type", "Please Select an image file", "error");
            setImgUrl(null);
            
        }
    }
   return {handleImageChange, imgUrl};
}

export default usePreviewImage