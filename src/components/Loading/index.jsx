import BounceLoader from "react-spinners/BounceLoader";

const Loading = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };


    return (
        <div style={style}>
            <BounceLoader color="#36d7b7" />

        </div>
    )

}

export default Loading;