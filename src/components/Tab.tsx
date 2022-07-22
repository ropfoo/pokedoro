import clsx from 'clsx';
import { Accessor } from 'solid-js';
import { Mode } from '../App';

interface TabProps {
    title: string;
    type: 'pause' | 'work';
    mode: Accessor<Mode>;
    onClick: () => void;
}
export default function Tab({ title, onClick, mode, type }: TabProps) {
    return (
        <button
            onClick={onClick}
            class={clsx(
                'rounded-lg border-2 p-2 text-slate-600 transition-colors hover:text-white',
                {
                    ' border-slate-400 text-slate-400': mode().name === type,
                    'border-slate-800 text-slate-600': mode().name !== type,
                }
            )}>
            <h3>{title}</h3>
        </button>
    );
}
