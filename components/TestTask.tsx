import {FC} from "react";
import {Task} from "@prisma/client";
import {Box} from "@chakra-ui/react";
import s from "../styles/Proto.App.module.scss";
import classNames from "classnames";
import {TestScreenshots} from "@components/EventDisplay";
import {useTranslation} from "next-i18next";

export const TOP_ROW_ID = "top-row";
export const BOTTOM_ROW_ID = "bottom-row";
export const TEST_OBJ_ID = "test-obj";

export const TestTask: FC<{
  task: Task;
  taskIdx: number;
  onClick: (n: number) => void;
}> = ({ task, onClick }) => {
  const { t } = useTranslation();
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
      <div className={classNames(s.block1, s.block, s.text)}>
        {t("is rotated to")}
      </div>
      <img
        alt={"test image"}
        src={referenceShapeRotated}
        className={classNames(s.block13, s.block)}
      />
      <div className={classNames(s.block2, s.block, s.text)}>{t("as")}</div>
      <img
        id={TEST_OBJ_ID}
        alt={"test image"}
        src={testShape}
        className={classNames(s.block22, s.block)}
      />
      <hr
        style={{
          position: "absolute",
          top: "30%",
          left: "20%",
          width: "60%",
          height: "2px",
          background: "#00000033",
        }}
      />
      <div className={classNames(s.block3, s.block, s.text)}>
        {t("is rotated to")}
      </div>
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
      <Box
        id={TOP_ROW_ID}
        pos={"absolute"}
        top={0}
        left={"20%"}
        width={"60%"}
        height={"30%"}
        zIndex={-1}
      />
      <Box
        id={BOTTOM_ROW_ID}
        pos={"absolute"}
        bottom={0}
        left={0}
        width={"100%"}
        height={"40%"}
        zIndex={-1}
      />
    </Box>
  );
};
