import { FC } from "react";
import { Task } from "@prisma/client";
import { Box } from "@chakra-ui/react";
import s from "../styles/Proto.App.module.scss";
import classNames from "classnames";
import { TestScreenshots } from "@components/EventDisplay";

export const TestTask: FC<{
  task: Task;
  taskIdx: number;
  onClick: (n: number) => void;
}> = ({ task, onClick }) => {
  const {
    referenceShape,
    referenceShapeRotated,
    testShape1,
    testShape2,
    testShape3,
    testShape4,
    testShape5,
    testShape,
  } = task.images! as TestScreenshots;
  return (
    <Box className={s.blockGrid2}>
      <img
        alt={"test image"}
        src={referenceShape}
        className={classNames(s.block11, s.block)}
      />
      <div className={classNames(s.block1, s.block, s.text)}>is rotated to</div>
      <img
        alt={"test image"}
        src={referenceShapeRotated}
        className={classNames(s.block13, s.block)}
      />
      <div className={classNames(s.block2, s.block, s.text)}>as</div>
      <img
        alt={"test image"}
        src={testShape}
        className={classNames(s.block22, s.block)}
      />
      <div className={classNames(s.block3, s.block, s.text)}>is rotated to</div>
      <div className={classNames(s.blockWithVariants, s.block)}>
        <img
          alt={"test image"}
          onClick={() => onClick(1)}
          src={testShape1}
          className={s.block}
        />
        <img
          alt={"test image"}
          onClick={() => onClick(2)}
          src={testShape2}
          className={s.block}
        />
        <img
          alt={"test image"}
          onClick={() => onClick(3)}
          src={testShape3}
          className={s.block}
        />
        <img
          alt={"test image"}
          onClick={() => onClick(4)}
          src={testShape4}
          className={s.block}
        />
        <img
          alt={"test image"}
          onClick={() => onClick(5)}
          src={testShape5}
          className={s.block}
        />
      </div>
      <div className={classNames(s.blockWithVariants2, s.block)}>
        <Box>1</Box>
        <Box>2</Box>
        <Box>3</Box>
        <Box>4</Box>
        <Box>5</Box>
      </div>
    </Box>
  );
};
