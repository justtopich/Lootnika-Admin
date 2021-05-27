import React from "react";
import { Space, Card, List } from 'antd';
import { Props } from '../config/index.type';
import { version } from '../config/config'

export default function About(props: Props) {

  const dependencies = {
    "@loadable/component": "^5.14.1",
    "@testing-library/jest-dom": "^5.11.4",
    "@testing-library/react": "^11.1.0",
    "@testing-library/user-event": "^12.1.10",
    "@types/humanize-duration": "^3.18.1",
    "@types/jest": "^26.0.15",
    "@types/node": "^12.0.0",
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    "@types/react-router-dom": "^5.1.7",
    "antd": "^4.15.4",
    "axios": "^0.21.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-redux": "^7.2.4",
    "react-router-cache-route": "^1.11.0",
    "react-router-dom": "^5.2.0",
    "react-scripts": "4.0.3",
    "redux": "^4.1.0",
    "typescript": "^4.1.2",
    "web-vitals": "^1.0.1"
  }

    return (
      <Space align="start" wrap>
        <Card title="About" style={{ width: 300 }}>
          <h3>{version}</h3>
          <h5>Lootnika control panel</h5>
          <h4>Lootnika is ETL framework written on Python3</h4>
        </Card>
        <Card title="Dependencies" >
          <List size="small"
            dataSource={Object.entries(dependencies)}
            renderItem={item => 
              <List.Item>
                <span className="simple-list-item">{item[0]}</span>
                <span className="simple-list-item">{item[1]}</span>
              </List.Item>
            }
          />
        </Card>
      </Space>
    );
};
