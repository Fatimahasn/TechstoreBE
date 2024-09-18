exports.getRole=(id)=>{
    switch (id) {
      case '0':
        return 'Admin';
      case '1':
        return 'User';
      default:
        return 'User';
    }
  }