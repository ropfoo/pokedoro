import { Component, createEffect, createSignal } from 'solid-js';

import dayjs from 'dayjs';

import pauseImg from './assets/pause.webp';
import workImg from './assets/bike-riding.gif';
import workStopImg from './assets/bike-stop.gif';
import Tab from './components/Tab';
import { playAudio } from './lib/play-audio';

export type Mode = {
    name: 'pause' | 'work';
    minutes: number;
};

const WorkMode: Mode = { name: 'work', minutes: 25 };
const PauseMode: Mode = { name: 'pause', minutes: 5 };

const App: Component = () => {
    const [startTime] = createSignal(dayjs(0));
    const [mode, setMode] = createSignal<Mode>(WorkMode);
    const [counter, setCounter] = createSignal(
        startTime().add(mode().minutes, 'minutes')
    );

    const [move, setMove] = createSignal(0);

    const [running, setRunning] = createSignal(false);

    let interval: any;

    createEffect(() => {
        const onEnd = async () => {
            if (counter() <= startTime() && running()) {
                await playAudio(mode());
                setRunning(false);
            }
        };
        onEnd();
    });

    createEffect(() => {
        if (counter() <= startTime() && !running()) {
            setMode(m => (m.name === 'pause' ? WorkMode : PauseMode));
        }
    });

    createEffect(() => {
        if (running()) {
            interval = setInterval(() => {
                setMove(m => m + 1);
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
            <h1 class=' text-6xl font-bold text-slate-600'>
                {counter().format('mm:ss')}
            </h1>
            <div class='mb-16' />
            <div class='flex w-6/12 min-w-[300px] max-w-[400px] flex-col items-center justify-center rounded-xl border-2 border-slate-600 bg-slate-800'>
                <div class='flex w-full justify-center p-3'>
                    <Tab
                        mode={mode}
                        title='work'
                        type='work'
                        onClick={() => setMode(WorkMode)}
                    />
                    <div class='ml-9' />
                    <Tab
                        mode={mode}
                        type='pause'
                        title='small break'
                        onClick={() => setMode(PauseMode)}
                    />
                </div>
                <div class='mb-16' />
                <div>
                    <button
                        class='p-2 text-2xl text-slate-400 transition-all hover:scale-105 hover:text-white'
                        onClick={() => setRunning(r => !r)}>
                        {running() ? 'pause' : 'start'}
                    </button>
                </div>
                <div class='mb-16' />

                <div
                    class='flex h-32 items-end justify-end overflow-hidden '
                    style={{ transform: `translate(0}px)` }}>
                    {mode().name === 'pause' && (
                        <img class='w-20' src={pauseImg} alt='' />
                    )}
                    {mode().name === 'work' && (
                        <img
                            style={{ transform: 'scaleX(-1)' }}
                            class='w-20'
                            src={running() ? workImg : workStopImg}
                            alt=''
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
