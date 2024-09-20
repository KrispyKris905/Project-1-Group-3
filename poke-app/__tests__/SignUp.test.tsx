import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import SignupScreen from '@/app/SignUp';
import * as pokeDb from '@/app/poke';