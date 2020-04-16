import React from 'react';
import classNames from 'classnames';
import { Button, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

const LoginSubmit = ({ className, ...rest }) => {
  const clsString = classNames(styles.submit, className);
  return (// 登录按钮
    <FormItem>
      <Button size="large" className={clsString} type="primary" htmlType="submit" {...rest} />
    </FormItem>
  );
};

export default LoginSubmit;
