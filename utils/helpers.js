import fs from 'fs';

export const RemoveFile = async (filePath) => {
    console.log('RemoveFile', filePath);

    if (filePath) {
        fs.unlink(filePath, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return { Success: false, message: 'no such file or directory Found' }

                }
                console.error('Error deleting file:', err);
                return { Success: false, message: 'Error deleting file' }

                // Handle the error, e.g., send an error response to the client
            } else {
                console.log('File deleted successfully:', filePath);
                return { Success: true, message: 'File deleted successfully' }

                // File successfully deleted, proceed with your logic
            }
        });
    } else {
        console.warn('No file path found to delete.');
        return { Success: false, message: 'No file path found to delete.' }
        // Handle cases where no file was uploaded or path is missing
    }


}