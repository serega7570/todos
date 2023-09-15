import { FC, useState } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CContainer,
    CFormInput,
    CListGroup,
    CListGroupItem,
    CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilCircle } from '@coreui/icons';
import { Task } from './app-types';
import clsx from 'clsx';

const App: FC = () => {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tasksType, setType] = useState('all');

    const completedTasks = tasks.filter((task) => task.completed);
    const incompletedTasks = tasks.filter((task) => !task.completed);
    const selectedTasks = tasksType === 'completed' ? completedTasks : tasksType === 'all' ? tasks : incompletedTasks;

    const handleCreateTask = () => {
        setNameError(false);
        if (tasks.find((task) => task.text === name)) {
            setNameError(true);
            return;
        }
        if (!name) {
            return;
        }
        const newTask = {
            text: name,
            completed: false,
        };
        setTasks((tasks) => [...tasks, newTask]);
        setName('');
    };

    const handleChangeComplete = (text: string, completed: boolean) => {
        setTasks(tasks.map((task) => (task.text === text ? { ...task, completed: !completed } : task)));
        if (!!completedTasks.length) {
            setType('all');
        }
    };

    const handleAllIncomplete = () => {
        setTasks(
            tasks.map((task) => {
                return { ...task, completed: false };
            })
        );
        setType('all');
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCard>
                            <CCardHeader component="h5">Список задач ({tasks.length})</CCardHeader>
                            <CCardBody>
                                <CListGroup flush>
                                    {selectedTasks?.map(({ text, completed }) => {
                                        return (
                                            <CListGroupItem onClick={() => handleChangeComplete(text, completed)}>
                                                <div>
                                                    <CIcon
                                                        className={clsx(completed && 'text-success', 'me-2')}
                                                        icon={completed ? cilCheckCircle : cilCircle}
                                                    />
                                                    <span className={clsx(completed && 'text-decoration-line-through')}>
                                                        {text}
                                                    </span>
                                                </div>
                                            </CListGroupItem>
                                        );
                                    })}
                                    <div className="d-flex pt-2">
                                        <CFormInput
                                            value={name}
                                            placeholder="Новая задача"
                                            invalid={nameError}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                            }}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
                                        />
                                        <CButton
                                            disabled={!name}
                                            color="success"
                                            className="ms-2 text-white"
                                            onClick={handleCreateTask}
                                        >
                                            Добавить
                                        </CButton>
                                    </div>
                                    <div className="text-danger" hidden={!nameError}>
                                        <small>Задача с таким названием уже существует</small>
                                    </div>
                                </CListGroup>
                            </CCardBody>
                            <CCardFooter>
                                <CContainer className="p-0">
                                    <CRow>
                                        <CCol>Активных задач: {incompletedTasks.length}</CCol>
                                        <CCol>
                                            <div className="text-center">
                                                <CButtonGroup size="sm" role="group" aria-label="Small button group">
                                                    <CButton
                                                        active={tasksType === 'all'}
                                                        color="primary"
                                                        variant="outline"
                                                        onClick={() => setType('all')}
                                                    >
                                                        Все
                                                    </CButton>
                                                    <CButton
                                                        active={tasksType === 'active'}
                                                        disabled={!incompletedTasks.length}
                                                        color="primary"
                                                        variant="outline"
                                                        onClick={() => setType('active')}
                                                    >
                                                        Активные
                                                    </CButton>
                                                    <CButton
                                                        active={tasksType === 'completed'}
                                                        disabled={!completedTasks.length}
                                                        color="primary"
                                                        variant="outline"
                                                        onClick={() => setType('completed')}
                                                    >
                                                        Выполненные
                                                    </CButton>
                                                </CButtonGroup>
                                            </div>
                                        </CCol>
                                        <CCol className="text-end">
                                            <CButton
                                                disabled={!completedTasks.length}
                                                className="text-white"
                                                size="sm"
                                                color="danger"
                                                onClick={handleAllIncomplete}
                                            >
                                                Очистить выполненные
                                            </CButton>
                                        </CCol>
                                    </CRow>
                                </CContainer>
                            </CCardFooter>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
};

export default App;
