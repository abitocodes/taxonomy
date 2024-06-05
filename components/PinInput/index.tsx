"use client"

import React, { Component } from 'react';
import PinItem from '@/components/PinInput/PinItem';

interface PinInputProps {
  initialValue?: string | number;
  length: number;
  type?: string;
  onComplete?: (pin: string, index: number) => void;
  validate?: (value: string) => string;
  secret?: boolean;
  disabled?: boolean;
  focus?: boolean;
  onChange?: (pin: string, index: number) => void;
  inputMode?: string;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties
  inputFocusStyle?: React.CSSProperties;
  autoSelect?: boolean;
  regexCriteria?: RegExp;
  ariaLabel?: string;
  placeholder?: string;
  secretDelay?: number;
}

class PinInput extends Component<PinInputProps> {
  private values: (string | undefined)[];
  private elements: any[];
  private currentIndex: number;

  constructor(props: PinInputProps) {
    super(props);
  
    this.values = Array(props.length)
      .fill('')
      .map((x, i) => props.initialValue?.toString()[i] || '');
    this.elements = [];
    this.currentIndex = 0;

    this.onPaste = this.onPaste.bind(this);
  }

  componentDidMount() {
    if (this.props.focus && this.props.length) this.elements[0].focus();
  }

  clear() {
    this.elements.forEach(e => e.clear());
    this.values = this.values.map(() => undefined);
    this.elements[0].focus();
  }

  focus() {
    if (this.props.length) this.elements[0].focus();
  }

  onItemChange(value: string, isPasting: boolean, index: number) {
    const { length, onComplete, onChange } = this.props;
    let currentIndex = index;

    this.values[index] = value;

    if (value.length === 1 && index < length - 1) {
      currentIndex += 1;
      this.elements[currentIndex].focus();
    }

    const pin = this.values.join('');

    if (!isPasting) {
      onChange?.(pin, currentIndex);
    }

    if (pin.length === length) {
      if (isPasting && index < length - 1) {
        return;
      }

      onComplete?.(pin, currentIndex);
    }
  }

  onBackspace(index: number) {
    if (index > 0) {
      this.elements[index - 1].focus();
    }
  }

  onPaste(value: string) {
    const { length } = this.props;
    if (value.length !== length) {
      return;
    }

    this.elements.forEach((el, index) => el.update(value[index], true));
  }

  render() {
    return (
      <div style={this.props.style} className='pincode-input-container'>
        {this.values.map((e, i) => (
          <PinItem
            initialValue={e}
            ref={n => { this.elements[i] = n; }}
            key={i}
            disabled={this.props.disabled}
            onBackspace={() => this.onBackspace(i)}
            secret={this.props.secret || false}
            onChange={(v, isPasting) => this.onItemChange(v, isPasting as boolean, i)}
            type={this.props.type}
            inputMode={this.props.inputMode}
            validate={this.props.validate}
            inputStyle={this.props.inputStyle as React.CSSProperties}
            inputFocusStyle={this.props.inputFocusStyle as React.CSSProperties}
            autoSelect={this.props.autoSelect}
            onPaste={(i === 0 ? this.onPaste : null) as (value: string) => void}
            regexCriteria={this.props.regexCriteria}
            ariaLabel={this.props.ariaLabel}
            placeholder={this.props.placeholder}
            secretDelay={this.props.secretDelay}
          />
        ))}
      </div>
    );
  }
}

export default PinInput;