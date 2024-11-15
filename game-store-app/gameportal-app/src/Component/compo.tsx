import styles from "./compo.module.css";

interface LabelModi {
  name: string;
}
function Label({ name }: LabelModi) {
  return (
    <>
      <label className={styles.Welcome}>{name}</label>
    </>
  );
}

export default Label;
