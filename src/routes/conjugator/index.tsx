import { FunctionalComponent, h } from "preact";
import * as style from "./style.css";

interface Props {
    user: string;
}

const Conjugator: FunctionalComponent<Props> = (props: Props) => {
    return (
        <div class={style.profile}>
            <h1>Conjugator</h1>
        </div>
    );
};

export default Conjugator;
