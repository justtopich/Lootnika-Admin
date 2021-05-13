import React from "react";
import { Space, Card } from 'antd';
import { Props } from '../config/index.type';

export default function About(props: Props) {
    return (
      <Space direction="vertical">
        <Card title="Card" style={{ width: 300 }}>
          <p>This is about</p>
        </Card>
      </Space>
    );
};
