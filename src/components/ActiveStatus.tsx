"use client";

import useActiveChannel from "@/hooks/useActiveChannel";
import React from "react";

const ActiveStatus = () => {
    useActiveChannel();
    return null;
};

export default ActiveStatus;
