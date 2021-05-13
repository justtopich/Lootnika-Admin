import React from "react";
import "./index.css";
import ImgLoading from "../../assets/loading.gif";

export default function LoadingComponent(): JSX.Element {
  return (
    <div className="loading">
      <img src={ ImgLoading } alt='' />
    </div>
  );
}
