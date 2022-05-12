import { FC } from "react";
import { Task } from "@prisma/client";
import { Box } from "@chakra-ui/react";
import s from "../styles/Proto.App.module.scss";
import classNames from "classnames";
import { getScreenName } from "../utils/GenerateScene";

export const TestTask: FC<{
  task: Task;
  taskIdx: number;
  onClick: (n: number) => void;
}> = ({ task, taskIdx, onClick }) => (
  <>
    <Box>You are currently on the task {task.taskNumber}</Box>
    <div className={s.blockGrid2}>
      <img
        alt={"test image"}
        src={`/${task.imageUrl}${getScreenName(task.taskNumber, 1)}`}
        className={classNames(s.block11, s.block)}
      />
      <div className={classNames(s.block1, s.block)}>is rotated to</div>
      <img
        alt={"test image"}
        src={`/${task.imageUrl}${getScreenName(task.taskNumber, 2)}`}
        className={classNames(s.block13, s.block)}
      />
      <div className={classNames(s.block2, s.block)}>as</div>
      <img
        alt={"test image"}
        src={`/${task.imageUrl}${getScreenName(task.taskNumber, 3)}`}
        className={classNames(s.block22, s.block)}
      />
      <div className={classNames(s.block3, s.block)}>is rotated to</div>
      <div className={classNames(s.blockWithVariants, s.block)}>
        <img
          alt={"test image"}
          onClick={() => onClick(1)}
          src={`/${task.imageUrl}${getScreenName(task.taskNumber, 4)}`}
          className={s.block}
        />
        <img
          alt={"test image"}
          onClick={() => onClick(2)}
          src={`/${task.imageUrl}${getScreenName(task.taskNumber, 5)}`}
          className={s.block}
        />
        <img
          alt={"test image"}
          onClick={() => onClick(3)}
          src={`/${task.imageUrl}${getScreenName(task.taskNumber, 6)}`}
          className={s.block}
        />
        <img
          alt={"test image"}
          onClick={() => onClick(4)}
          src={`/${task.imageUrl}${getScreenName(task.taskNumber, 7)}`}
          className={s.block}
        />
        <img
          alt={"test image"}
          onClick={() => onClick(5)}
          src={`/${task.imageUrl}${getScreenName(task.taskNumber, 8)}`}
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
    </div>
  </>
);
