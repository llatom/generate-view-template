import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import './template.{cssType}';

function Template(props) {
  const [state, setState] = useState({});

  const myRef = useRef(null);

  const from = window.deviceType;
  const bodyClassName = cx('Template', {
    'Template-desktop': from === 'desktop',
    'Template-tablet': from === 'tablet',
    'Template-mobile': from === 'mobile',
  });

  useEffect(() => {}, []);

  console.log(
    '%c ------ RENDER Template ------',
    'color:red;font-size:16px;line-height:30px',
    props
  );
  return (
    <div className={bodyClassName}>
      <h1>Template</h1>
    </div>
  );
}

export default Template;
