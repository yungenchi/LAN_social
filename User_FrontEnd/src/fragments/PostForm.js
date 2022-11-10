import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function PostForm({
    initialText = "",
    addComment,
    editComment,
    submitLabel,
    handleCancel,
    type

}) {
    const [text, setText] = useState(initialText);
    const [image, setImage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null);

    const resetPostContent = () => {
        setText("");
        setImage(null);
        setErrorMessage(null);
        handleCancel();
    }

    const fileReader = new FileReader();
    const handleInputImg = (event) => {
        const img = event.target.files[0]
        fileReader.readAsDataURL(img)
        fileReader.onload = () => {
        var base64Url = fileReader.result;
        setImage(base64Url);
        };
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // As React Quill uses HTML tags within the text the empty check first removes all HTML elements using a regex.
        if (text.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
            setErrorMessage("A post cannot be empty.");
            return;
        }else if(text.replace(/<(.|\n)*?>/g, "").trim().length > 600) {
            setErrorMessage("The maximum length of a post is 600 words.");
            return 
        }
        if(type === "post"){
            // Create post.
            addComment(text, image);
            setText("");
            setImage(null)
            setErrorMessage(null)
        }else if (type === "edit"){
            // Edit post.
            editComment(text);
            setText("");
            setErrorMessage(null)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <div className="form-group" style={{ marginTop: "10px" , marginBottom: "60px" }}>
                    <ReactQuill theme="snow" value={text} onChange={setText} style={{ height: "120px" }} />
                </div>
                {errorMessage !== null &&
                    <div className="form-group">
                        <span className="text-danger">{errorMessage}</span>
                    </div>
                }
                <div className="form-group">
                    <input type="button" className="btn btn-danger mr-5" value="Cancel" onClick={resetPostContent} />
                    <input type="submit" className="btn btn-primary" value={submitLabel} />
                    <input className="imgInput btn btn-secondary mr-3" type="file" name="photo" id="photo" accept="image/*" onChange={handleInputImg} />
                </div>
            </fieldset>
        </form>
    );
};