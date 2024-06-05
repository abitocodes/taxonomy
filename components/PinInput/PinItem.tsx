import PropTypes from 'prop-types';
import React, { Component, ChangeEvent, KeyboardEvent, FocusEvent, ClipboardEvent } from 'react';

interface PinItemProps {
  initialValue?: string;
  onChange: (value: string, isPasting?: boolean) => void;
  onBackspace: () => void;
  onPaste?: (value: string) => void;
  secret?: boolean;
  secretDelay?: number;
  disabled?: boolean;
  type?: string;
  inputMode?: string;
  validate?: (value: string) => string;
  inputStyle: React.CSSProperties;
  inputFocusStyle: React.CSSProperties;
  autoSelect?: boolean;
  regexCriteria?: RegExp;
  ariaLabel?: string;
  placeholder?: string;
}

interface PinItemState {
  value: string;
  showSecret: boolean;
  focus: boolean;
}

// const styles = {
//   input: {
//     padding: 0,
//     margin: '0 2px',
//     textAlign: 'center',
//     border: '1px solid',
//     background: 'transparent',
//     width: '50px',
//     height: '50px',
//   },
//   inputFocus: {
//     outline: 'none',
//     boxShadow: 'none',
//   },
// };

class PinItem extends Component<PinItemProps, PinItemState> {
  private secretTimeout: NodeJS.Timeout | null = null;
  private inputTimeout: NodeJS.Timeout | null = null;
  private inputRef: React.RefObject<HTMLInputElement>;

  static propTypes = {
    initialValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBackspace: PropTypes.func.isRequired,
    onPaste: PropTypes.func,
    secret: PropTypes.bool,
    secretDelay: PropTypes.number,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    inputMode: PropTypes.string,
    validate: PropTypes.func,
    inputStyle: PropTypes.object.isRequired,
    inputFocusStyle: PropTypes.object.isRequired,
    autoSelect: PropTypes.bool,
    regexCriteria: PropTypes.any,
    ariaLabel: PropTypes.string,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    secret: false,
    type: 'numeric',
    inputMode: undefined,
    disabled: false,
    validate: undefined,
    autoSelect: false,
    onPaste: undefined,
    regexCriteria: /^[a-zA-Z0-9]+$/,
    ariaLabel: '',
    placeholder: ''
  };

  constructor(props: PinItemProps) {
    super(props);
    this.state = {
      value: this.validate(props.initialValue || ''),
      showSecret: this.props.secret || false,
      focus: false,
    };
    this.inputRef = React.createRef();
  }

  componentWillUnmount() {
    if (this.secretTimeout) clearTimeout(this.secretTimeout);
    if (this.inputTimeout) clearTimeout(this.inputTimeout);
  }

  onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 8 && (!this.state.value || !this.state.value.length)) {
      this.props.onBackspace();
    }
  };

  clear = () => {
    this.setState({
      value: '',
    });
  };

  setSecretDelayed = (value: string) => {
    this.setState({ showSecret: false });
    this.secretTimeout = setTimeout(() => {
      this.setState({
        showSecret: value ? true : false,
      });
    }, this.props.secretDelay || 0);
  };

  update = (updatedValue: string, isPasting = false) => {
    const value = this.validate(updatedValue);
    if (this.state.value === value && !isPasting) return;

    if (value.length < 2) {
      this.setState({
        value,
      });

      this.inputTimeout = setTimeout(() => {
        this.props.onChange(value, isPasting);
      }, 0);
    }
  };

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.update(e.target.value);
  };

  focus = () => {
    if (this.inputRef.current) this.inputRef.current.focus();
  };

  onFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (this.props.autoSelect) {
      e.target.select();
    }
    this.setState({ focus: true });
  };

  onBlur = () => {
    this.setState({ focus: false });
  };

  onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (!this.props.onPaste) {
      return;
    }

    const value = e.clipboardData.getData('text');
    this.props.onPaste(value);
  };

  validate = (value: string): string => {
    if (this.props.secretDelay) this.setSecretDelayed(value);

    if (this.props.validate) {
      return this.props.validate(value);
    }

    if (this.props.type === 'numeric') {
      const numCode = value.charCodeAt(0);
      const isInteger =
        numCode >= '0'.charCodeAt(0) && numCode <= '9'.charCodeAt(0);
      return isInteger ? value : '';
    }
    if (this.props.regexCriteria && this.props.regexCriteria.test(value)) {
      return value.toUpperCase();
    }

    return '';
  };

  render() {
    const { focus, value } = this.state;
    const { type, inputMode, inputStyle, inputFocusStyle } = this.props;
    const inputType = type === 'numeric' ? 'tel' : type || 'text';
    return (
        <input
            disabled={this.props.disabled}
            className={`pincode-input-text w-12 h-12 p-0 m-0.5 text-center border bg-transparent ${focus ? 'rounded-md' : ''}`}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            placeholder={this.props.placeholder || value}
            aria-label={this.props.ariaLabel || value}
            maxLength={1}
            autoComplete='off'
            type={this.state.showSecret ? 'password' : inputType}
            inputMode={["none", "numeric", "tel", "text", "search", "email", "url", "decimal"].includes(inputMode || '') ? inputMode as "none" | "numeric" | "tel" | "text" | "search" | "email" | "url" | "decimal" : 'text'}
            pattern={this.props.type === 'numeric' ? '[0-9]*' : '^[a-zA-Z0-9]+$'}
            ref={this.inputRef}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onPaste={this.onPaste}
            value={value}
        />
    );
  }
}

export default PinItem;