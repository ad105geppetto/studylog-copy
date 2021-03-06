import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Prelogin from "components/Prelogin";
import axios, { AxiosError, AxiosResponse } from "axios";
import styled from "styled-components";
import Nav from "components/Nav";

const Root = styled.div`
  width: 100vw;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 50vw;
  display: flex;
  flex-direction: column;
  column-gap: 24px;
  padding-top: 10vh;
  margin-bottom: 13vh;
  .title {
    height: 10vh;
    margin-top: 1vw;
    margin-bottom: 3vh;
  }
  .content {
    height: 15vh;
    margin-top: 1vw;
    margin-bottom: 5vh;
  }

  .create {
    height: 7vh;
    margin-top: 4vw;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    margin: auto;
  }
`;

const Label = styled.label`
  width: 15vh;
  height: 7vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1.7rem;
  color: white;
`;

const Input = styled.input`
  width: 50vw;
  height: 5.5vh;
  font-size: 1rem;
  align-items: center;
  background-color: white;
  border: 0.2rem solid lightgrey;
  border-radius: 1vh;
`;

const Button = styled.button`
  width: 12vw;
  height: 8vh;
  border: 2px solid black;
  border-radius: 10px;
  margin-top: 10px;
  margin-right: 10px;
  background-color: white;
  padding: 5px;
`;

interface socketInterface {
  setRoomId: any;
}

const Creatingroom = ({ setRoomId }: socketInterface) => {
  const SERVER = process.env.REACT_APP_SERVER || "http://localhost:4000";
  const [roomtTitle, setRoomTitle] = useState("");
  const [roomContent, setRoomContent] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const navigate = useNavigate();

  const userInfo = useSelector((state: any) => state.userInfoReducer.userInfo);

  const titleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomTitle(e.target.value);
  };

  const contentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomContent(e.target.value);
  };

  const createRoomHandler = () => {
    if (roomtTitle.length === 0 || roomContent.length === 0) {
      setErrMessage(() => "???????????? ????????? ??????????????????");
      return;
    }

    axios
      .post(
        `${SERVER}/room`,
        { title: roomtTitle, content: roomContent },
        {
          headers: { authorization: `Bearer ${userInfo.accessToken}` },
        }
      )
      .then((res: AxiosResponse) => {
        setRoomId(res.data.id);
        navigate(`/room/${res.data.id}`);
      })
      .catch((err: AxiosError) => {
        setErrMessage(() => "???????????? ????????? ??????????????????");
      });
  };

  const checkLoginState = useCallback(() => {
    if (userInfo.accessToken) {
      setIsLogin(() => true);
    }
  }, [userInfo.accessToken]);

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState]);

  return (
    <Root>
      <Nav />
      <Container>
        {isLogin ? (
          <div>
            <Label htmlFor="roomName">?????????</Label>
            <Input
              className="title"
              type="text"
              onChange={titleHandler}
              id="roomName"
              placeholder="????????? ??? ????????? ??????????????????"
            ></Input>

            <Label htmlFor="content">??????</Label>
            <Input
              className="content"
              type="text"
              onChange={contentHandler}
              id="content"
              placeholder="?????? ????????? ????????? ??????????????????"
            ></Input>
            <div>{errMessage}</div>
            <Button className="create" onClick={createRoomHandler}>
              ??????
            </Button>
          </div>
        ) : (
          <Prelogin color="white" />
        )}
      </Container>
    </Root>
  );
};

export default Creatingroom;
