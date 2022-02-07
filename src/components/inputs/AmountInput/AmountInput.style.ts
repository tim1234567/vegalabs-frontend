import { makeStyles } from 'core/styles';

export const useStyles = makeStyles(
  () => ({
    inputs: {
      display: 'flex',
    },
    decimalInputWrapper: {
      flexGrow: 1,
      position: 'relative',
      zIndex: 1,
    },
    withCurrencySelect: {
      '& $decimalInput': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
    select: {
      flexShrink: 0,

      // Hint to merge select left border with the right border of the text input
      marginLeft: -1,

      '& .MuiOutlinedInput-root': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
      '& .MuiSelect-iconOutlined': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        display: 'none',
      },
      '& .MuiOutlinedInput-input.MuiSelect-select': {
        paddingRight: '18px !important',
        fontSize: 21,
        fontWeight: 'normal',
        fontFamily: 'Monaco',
        lineHeight: 1.8,
        position: 'relative',
        zIndex: 1,
        overflow: 'initial',
      },
      '& .MuiOutlinedInput-input:before': {
        content: "''",
        position: 'absolute',
        top: 16,
        right: 14,
        bottom: 18,
        left: 5,
        background: '#F7F8FA',
        boxShadow: '0px 2px 20px rgb(0 0 0 / 10%)',
        borderRadius: 6,
        zIndex: '-1',
      },
    },
    decimalInput: {},
  }),
  { name: 'AmountInput' },
);
