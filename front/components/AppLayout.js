import propTypes from "prop-types";
import React from "react";
import Link from "next/link";

const AppLayout = ({ children }) => {
  return (
    <div>
      <div>
        <Link href="/">노드버드</Link>
        <Link href="/profile">프로필</Link>
        <Link href="/signup">가입하기</Link>
      </div>
      {children}
    </div>
  );
};

AppLayout.propTypes = {
  children: propTypes.node.isRequired,
};

export default AppLayout;
