import React, { useCallback } from "react";
import { Avatar, Button, Card } from "antd";
import { useDispatch } from "react-redux";
import { logoutAction } from "../reducers/user";

// eslint-disable-next-line react/prop-types
const UserProfile = () => {
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch(logoutAction());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">
          {" "}
          twit
          <br />0{" "}
        </div>,
        <div key="following">
          {" "}
          팔로잉
          <br />0{" "}
        </div>,
        <div key="follwers">
          {" "}
          팔로워
          <br />0{" "}
        </div>,
      ]}
    >
      <Card.Meta title="minwoo" avatar={<Avatar>MW</Avatar>} />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
