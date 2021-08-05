const customErrorGenerator = (message) => {
    return class extends Error {
        constructor() {
            super(message);
        }
    }
};


export const StorageLimitError = customErrorGenerator(`By uploading this file, you're exceeding your storage memory quota.`);
export const NoDataError = customErrorGenerator('No data provided ! Try again !');
export const FileUploadError = customErrorGenerator('Your file has not been uploaded to the server. Try again!')
export const NoParamsError = customErrorGenerator('Params are not specified')

