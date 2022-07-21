import { Component, createEffect, createSignal } from 'solid-js';

import dayjs from 'dayjs';

import pauseImg from './assets/pause.webp';
import pomodoroImg from './assets/pomodoro.gif';
import Tab from './components/Tab';
import { playAudio } from './lib/play-audio';

export type Mode = {
    name: 'pause' | 'work';
    minutes: number;
};

const WorkMode: Mode = { name: 'work', minutes: 0.1 };
const PauseMode: Mode = { name: 'pause', minutes: 5 };

const App: Component = () => {
    const [startTime] = createSignal(dayjs(0));
    const [mode, setMode] = createSignal<Mode>(WorkMode);
    const [counter, setCounter] = createSignal(
        startTime().add(mode().minutes, 'minutes')
    );

    const [running, setRunning] = createSignal(false);

    let interval: any;

    createEffect(() => {
        if (counter() <= startTime()) {
            playAudio(mode());
            setRunning(false);
        }
    });

    createEffect(() => {
        if (running()) {
            interval = setInterval(() => {
                setCounter(c => c.add(-1, 'seconds'));
                document.title = counter().format('mm:ss');
            }, 1000);
        } else {
            clearInterval(interval);
        }
    });

    createEffect(() => setCounter(startTime().add(mode().minutes, 'minutes')));

    return (
        <div class='flex h-screen flex-col items-center justify-center'>
            <h1 class=' text-9xl font-bold'>{counter().format('mm:ss')}</h1>
            <div class='mb-16' />
            <div>
                <Tab
                    mode={mode}
                    title='work'
                    onClick={() => setMode(WorkMode)}
                />
                <Tab
                    mode={mode}
                    title='pause'
                    onClick={() => setMode(PauseMode)}
                />
            </div>
            <div class='mb-16' />
            <div>
                <button onClick={() => setRunning(r => !r)}>
                    {running() ? 'pause' : 'start'}
                </button>
            </div>
            <div class='mb-16' />

            <div class='flex h-32 items-end justify-end overflow-hidden'>
                {mode().name === 'pause' && (
                    <img class='w-20' src={pauseImg} alt='' />
                )}
                {mode().name === 'work' && (
                    <img class='w-20' src={pomodoroImg} alt='' />
                )}
            </div>
        </div>
    );
};

export default App;
