import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
    height: 48
  },
}));

export default function SelectOptions(props) {
  const [selectedValue, setSelectedValue] = useState(props.value);

  const classes = useStyles();

  const handleChange = (e) => {
    setSelectedValue(e.target.value)
  }

  const handleClose = () => {
    props.onSave(props.id, selectedValue)
  }

  return (
    <>
      <FormControl className={classes.formControl}>
        {props.label && <InputLabel>{props.label}</InputLabel> }
        <Select
          multiple={props.multiple}
          value={selectedValue}
          onChange={handleChange}
          onClose={props.multiple ? handleClose : props.onSave(props.id, selectedValue)}
        >
          {props.items.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
