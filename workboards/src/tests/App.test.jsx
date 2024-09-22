// src/tests/App.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';

test('login functionality', async () => {
  render(
    <Router>
      <App />
    </Router>
  );

  // Check if login form is rendered
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

  // Fill in login form
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

  // Submit form
  fireEvent.click(screen.getByText(/log in/i));

  // Check if redirected to dashboard
  await screen.findByText(/my workboards/i);
  expect(screen.getByText(/create board/i)).toBeInTheDocument();
});

test('create board functionality', async () => {
  render(
    <Router>
      <App />
    </Router>
  );

  // Navigate to create board page
  fireEvent.click(screen.getByText(/create board/i));

  // Fill in create board form
  fireEvent.change(screen.getByLabelText(/board title/i), { target: { value: 'Test Board' } });
  fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });

  // Submit form
  fireEvent.click(screen.getByText(/create work board/i));

  // Check if new board is created and visible on dashboard
  await screen.findByText(/test board/i);
});

test('drag and drop functionality', async () => {
  render(
    <Router>
      <App />
    </Router>
  );

  // Navigate to a board
  fireEvent.click(screen.getByText(/test board/i));

  // Check if columns are rendered
  expect(screen.getByText(/to do/i)).toBeInTheDocument();
  expect(screen.getByText(/in progress/i)).toBeInTheDocument();
  expect(screen.getByText(/completed/i)).toBeInTheDocument();

  // Add a task
  fireEvent.click(screen.getByText(/add task/i));
  fireEvent.change(screen.getByLabelText(/task title/i), { target: { value: 'Test Task' } });
  fireEvent.click(screen.getByText(/add/i));

  // Check if task is added to 'To Do' column
  expect(screen.getByText(/test task/i)).toBeInTheDocument();

  // Simulate drag and drop
  const task = screen.getByText(/test task/i);
  const inProgressColumn = screen.getByText(/in progress/i).closest('div');

  fireEvent.dragStart(task);
  fireEvent.dragEnter(inProgressColumn);
  fireEvent.dragOver(inProgressColumn);
  fireEvent.drop(inProgressColumn);
  fireEvent.dragEnd(task);

  // Check if task is moved to 'In Progress' column
  expect(inProgressColumn).toContainElement(task);
});