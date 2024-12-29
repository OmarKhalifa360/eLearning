import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useNavigate, useParams } from 'react-router-dom';

function QuizCreate() {
  const { courseId } = useParams();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      text: '',
      question_type: 'MCQ',
      choices: [
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ],
      correct_answer: '',
    },
  ]);
  const navigate = useNavigate();

  // Handle adding a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        question_type: 'MCQ',
        choices: [
          { text: '', is_correct: false },
          { text: '', is_correct: false },
        ],
        correct_answer: '',
      },
    ]);
  };

  // Handle removing a question
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  // Handle question change
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Handle adding a choice to a question
  const addChoice = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices.push({ text: '', is_correct: false });
    setQuestions(newQuestions);
  };

  // Handle removing a choice from a question
  const removeChoice = (qIndex, cIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices = newQuestions[qIndex].choices.filter(
      (_, choiceIndex) => choiceIndex !== cIndex
    );
    setQuestions(newQuestions);
  };

  // Handle choice change
  const handleChoiceChange = (qIndex, cIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices[cIndex][field] = value;
    setQuestions(newQuestions);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const data = {
        title,
        course: courseId,
        questions,
      };
      await axios.post('/quizzes/', data);
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error('Error creating quiz:', err);
    }
  };

  return (
    <div className='container mt-5'>
      <h2>Create New Quiz</h2>
      <div className='mb-3'>
        <label className='form-label'>Quiz Title</label>
        <input
          type='text'
          className='form-control'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {questions.map((question, qIndex) => (
        <div key={qIndex} className='mb-4'>
          <h5>
            Question {qIndex + 1}
            <button
              className='btn btn-sm btn-danger ms-2'
              onClick={() => removeQuestion(qIndex)}
            >
              Remove Question
            </button>
          </h5>
          <div className='mb-3'>
            <label className='form-label'>Question Text</label>
            <input
              type='text'
              className='form-control'
              value={question.text}
              onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label className='form-label'>Question Type</label>
            <select
              className='form-select'
              value={question.question_type}
              onChange={(e) => handleQuestionChange(qIndex, 'question_type', e.target.value)}
            >
              <option value='MCQ'>Multiple Choice Question</option>
              <option value='TF'>True/False</option>
              <option value='SA'>Short Answer</option>
            </select>
          </div>
          {question.question_type === 'SA' ? (
            <div className='mb-3'>
              <label className='form-label'>Correct Answer</label>
              <input
                type='text'
                className='form-control'
                value={question.correct_answer}
                onChange={(e) => handleQuestionChange(qIndex, 'correct_answer', e.target.value)}
              />
            </div>
          ) : (
            <>
              <h6>Choices</h6>
              {question.choices.map((choice, cIndex) => (
                <div key={cIndex} className='mb-2 d-flex align-items-center'>
                  <input
                    type='text'
                    className='form-control me-2'
                    value={choice.text}
                    onChange={(e) =>
                      handleChoiceChange(qIndex, cIndex, 'text', e.target.value)
                    }
                  />
                  <input
                    type='checkbox'
                    className='form-check-input me-2'
                    checked={choice.is_correct}
                    onChange={(e) =>
                      handleChoiceChange(qIndex, cIndex, 'is_correct', e.target.checked)
                    }
                  />
                  <label className='form-check-label me-2'>Correct</label>
                  <button
                    className='btn btn-sm btn-outline-danger'
                    onClick={() => removeChoice(qIndex, cIndex)}
                  >
                    Remove Choice
                  </button>
                </div>
              ))}
              <button
                className='btn btn-sm btn-secondary'
                onClick={() => addChoice(qIndex)}
              >
                Add Choice
              </button>
            </>
          )}
        </div>
      ))}
      <button className='btn btn-secondary mb-3' onClick={addQuestion}>
        Add Question
      </button>
      <div>
        <button className='btn btn-primary' onClick={handleSubmit}>
          Create Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizCreate;