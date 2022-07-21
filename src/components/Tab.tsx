import clsx from 'clsx';
import { Accessor } from 'solid-js';
import { Mode } from '../App';

interface TabProps {
    title: string;
    mode: Accessor<Mode>;
    onClick: () => void;
}
export default function Tab({ title, onClick, mode }: TabProps) {
    return (
        <button
            onClick={onClick}
            class={clsx({
                'text-red-600': mode().name === title,
                'text-white': mode().name !== title,
            })}>
            <h3>{title}</h3>
        </button>
    );
}
