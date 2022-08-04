import React from "react";
import ReactLoading from "react-loading";
import { getAnnoucementsByUser } from "../action/action";
import { useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { IoClose } from "react-icons/io5";
import {
  AnnoucemnetBody,
  AnnouncementBox,
  Badge,
  ButtonRounded,
  From,
  Loader,
  Ruler,
  Subject,
} from "../styled-component";

function Annoucement({ toggle, setToggle }) {
  const {
    dispatch,
    state: {
      login: { token, databaseID },
      annoucement: { data, isLoading },
    },
  } = useContext(AppContext);

  useEffect(() => {
    if (!toggle) return;
    const userName = "utkarsh";
    getAnnoucementsByUser(dispatch, databaseID, token, userName);
  }, [toggle]);

  return (
    <AnnouncementBox toggle={toggle || undefined}>
      {isLoading ? (
        <Loader
          style={{
            backgroundColor: "transparent",
            boxShadow: "0 0 0 0 white",
          }}
        >
          <ReactLoading type="spinningBubbles" height={60} width={60} />
        </Loader>
      ) : (
        <>
          <div className="heading">
            <p>Annoucements</p>
            <IoClose as="button" onClick={() => setToggle(false)} />
          </div>
          {data?.length > 0 && (
            <ul className="overflow-y-auto h-full">
              {data.map((item) => {
                return (
                  <li key={item.AnnouncementID}>
                    <p>
                      <span>from </span> :{" "}
                      <From as="label">{item.AnnouncementCreatorName}</From>
                    </p>
                    <p>
                      <span>subject</span> :
                      <Subject as="label">{item.AnnouncementTitle}</Subject>
                    </p>
                    <AnnoucemnetBody>{item.AnnouncementBody}</AnnoucemnetBody>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </AnnouncementBox>
  );
}

export default Annoucement;
