import { Component, createEffect, createSignal } from 'solid-js';

import dayjs from 'dayjs';

import pauseImg from './assets/pause.webp';
import pomodoroImg from './assets/pomodoro.gif';

type mode = 'pause' | 'pomodoro';

const App: Component = () => {
    const [startTime] = createSignal(dayjs(0));
    const [goalTime, setGoalTime] = createSignal(
        startTime().add(25, 'minutes')
    );
    const [counter, setCounter] = createSignal(goalTime());
    const [mode, setMode] = createSignal<mode>('pomodoro');

    const [running, setRunning] = createSignal(false);
    let interval: any;

    function playAudio(type: mode) {
        const pomodoroAudio = new Audio(
            'https://vgmsite.com/soundtracks/pokemon-gameboy-sound-collection/ueldaopg/126-pokemon%20whistle.mp3'
        );
        const pauseAudio = new Audio(
            'https://vgmsite.com/soundtracks/pokemon-gameboy-sound-collection/znqhqixi/111-pokemon%20recovery.mp3'
        );

        if (type === 'pause') return pauseAudio.play();
        if (type === 'pomodoro') return pomodoroAudio.play();
    }

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

    const setTimer = (time: number) => {
        setRunning(true);
        setGoalTime(startTime().add(time, 'minutes'));
        setCounter(goalTime());
        document.title = counter().format('mm:ss');
    };

    return (
        <div class='flex h-screen flex-col items-center justify-center'>
            <h1 class=' text-9xl font-bold'>{counter().format('mm:ss')}</h1>
            <div class='mb-16' />
            <div>
                <button
                    disabled={running()}
                    onClick={() => {
                        setTimer(25);
                        setMode('pomodoro');
                    }}>
                    pomodor
                </button>
                <button
                    disabled={running()}
                    onClick={() => {
                        setTimer(5);
                        setMode('pause');
                    }}>
                    break
                </button>

                <button onClick={() => setRunning(r => !r)}>pause timer</button>
            </div>
            <div class='mb-16' />

            <div class='flex h-32 items-end justify-end overflow-hidden'>
                {mode() === 'pause' && (
                    <img class='w-20' src={pauseImg} alt='' />
                )}
                {mode() === 'pomodoro' && (
                    <img class='w-20' src={pomodoroImg} alt='' />
                )}
            </div>
        </div>
    );
};

export default App;
