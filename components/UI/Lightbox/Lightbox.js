import { SRLWrapper } from "simple-react-lightbox";
import { lightboxOptions } from "./../../../utilities/lightboxOptions";

function Lightbox({children}) {
    return (
        <SRLWrapper options={lightboxOptions}>
            {children}
        </SRLWrapper>
    )
}

export default Lightbox;
